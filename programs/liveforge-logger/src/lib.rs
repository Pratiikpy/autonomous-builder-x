use anchor_lang::prelude::*;
use sha2::{Sha256, Digest};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod liveforge_logger {
    use super::*;

    /// Initialize a new build session
    pub fn initialize_build(
        ctx: Context<InitializeBuild>,
        build_id: String,
        project_name: String,
    ) -> Result<()> {
        let build = &mut ctx.accounts.build;
        build.authority = ctx.accounts.authority.key();
        build.build_id = build_id;
        build.project_name = project_name;
        build.step_count = 0;
        build.started_at = Clock::get()?.unix_timestamp;
        build.completed_at = 0;
        build.status = BuildStatus::InProgress;
        
        emit!(BuildStarted {
            build_id: build.build_id.clone(),
            project_name: build.project_name.clone(),
            timestamp: build.started_at,
        });
        
        Ok(())
    }

    /// Log a build action with SHA256 verification
    pub fn log_action(
        ctx: Context<LogAction>,
        action_type: ActionType,
        description: String,
        content_hash: [u8; 32],
    ) -> Result<()> {
        let build = &mut ctx.accounts.build;
        let action = &mut ctx.accounts.action;
        
        require!(
            build.status == BuildStatus::InProgress,
            ErrorCode::BuildNotInProgress
        );
        
        build.step_count += 1;
        
        action.build = build.key();
        action.step_number = build.step_count;
        action.action_type = action_type;
        action.description = description.clone();
        action.content_hash = content_hash;
        action.timestamp = Clock::get()?.unix_timestamp;
        
        emit!(ActionLogged {
            build_id: build.build_id.clone(),
            step_number: action.step_number,
            action_type: action_type,
            description: description,
            content_hash: content_hash,
            timestamp: action.timestamp,
        });
        
        Ok(())
    }

    /// Mark build as complete
    pub fn complete_build(
        ctx: Context<CompleteBuild>,
        success: bool,
        program_id: Option<String>,
    ) -> Result<()> {
        let build = &mut ctx.accounts.build;
        
        build.completed_at = Clock::get()?.unix_timestamp;
        build.status = if success {
            BuildStatus::Completed
        } else {
            BuildStatus::Failed
        };
        build.deployed_program_id = program_id.clone();
        
        emit!(BuildCompleted {
            build_id: build.build_id.clone(),
            success,
            program_id,
            timestamp: build.completed_at,
            total_steps: build.step_count,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(build_id: String)]
pub struct InitializeBuild<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Build::INIT_SPACE,
        seeds = [b"build", build_id.as_bytes()],
        bump
    )]
    pub build: Account<'info, Build>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LogAction<'info> {
    #[account(mut)]
    pub build: Account<'info, Build>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + BuildAction::INIT_SPACE
    )]
    pub action: Account<'info, BuildAction>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteBuild<'info> {
    #[account(mut)]
    pub build: Account<'info, Build>,
    
    #[account(constraint = authority.key() == build.authority)]
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Build {
    pub authority: Pubkey,
    #[max_len(50)]
    pub build_id: String,
    #[max_len(100)]
    pub project_name: String,
    pub step_count: u32,
    pub started_at: i64,
    pub completed_at: i64,
    pub status: BuildStatus,
    #[max_len(100)]
    pub deployed_program_id: Option<String>,
}

#[account]
#[derive(InitSpace)]
pub struct BuildAction {
    pub build: Pubkey,
    pub step_number: u32,
    pub action_type: ActionType,
    #[max_len(200)]
    pub description: String,
    pub content_hash: [u8; 32],
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum BuildStatus {
    InProgress,
    Completed,
    Failed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ActionType {
    Analyze,
    GenerateCode,
    CompileProgram,
    RunTests,
    Deploy,
    GenerateSDK,
    GenerateFrontend,
    Document,
}

#[event]
pub struct BuildStarted {
    pub build_id: String,
    pub project_name: String,
    pub timestamp: i64,
}

#[event]
pub struct ActionLogged {
    pub build_id: String,
    pub step_number: u32,
    pub action_type: ActionType,
    pub description: String,
    pub content_hash: [u8; 32],
    pub timestamp: i64,
}

#[event]
pub struct BuildCompleted {
    pub build_id: String,
    pub success: bool,
    pub program_id: Option<String>,
    pub timestamp: i64,
    pub total_steps: u32,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Build is not in progress")]
    BuildNotInProgress,
}
