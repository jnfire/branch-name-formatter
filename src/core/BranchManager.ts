import { Branch } from '@/core/Branch'
import type { BranchType } from '@/core/BranchTypes'
import { LocalStorageManager } from '@/utils/LocalStorageManager'

// Shape of a branch as stored in localStorage. Entries saved by older
// versions have projectId/ticketId/featureName instead of branchName.
type StoredBranch = Partial<BranchType> & {
  projectId?: string
  ticketId?: string
  featureName?: string
}

export class BranchManager {
  private static instance: BranchManager
  private branches: Branch[] = []
  private lastId: number = 0

  private constructor() {}

  public static getInstance(): BranchManager {
    if (!BranchManager.instance) {
      BranchManager.instance = new BranchManager()
    }
    return BranchManager.instance
  }

  public getBranches(isDescending: boolean = true): Branch[] {
    if (!this.branches.length) {
      this.loadBranches()
    }
    return this.branches.sort((a, b) => {
      return isDescending ? this.descending(b, a) : this.ascending(a, b)
    })
  }

  private ascending(a: Branch, b: Branch) {
    return a.id - b.id
  }

  private descending(b: Branch, a: Branch) {
    return b.id - a.id
  }

  private loadBranches(): void {
    const localStorage = LocalStorageManager.getInstance()
    const branches = localStorage.get('branches')
    if (branches) {
      this.branches = (JSON.parse(branches) as StoredBranch[]).map((branch) => this.loadBranch(branch))
      if (this.branches.length > 10) {
        this.branches = this.branches.slice(-10)
      }
    }
    this.setLastId()
  }

  private loadBranch(data: StoredBranch): Branch {
    let branchName = data.branchName || ''
    
    // Retrocompatibilidad con datos antiguos guardados en localStorage
    if (!branchName) {
      const projectId = data.projectId ? `${data.projectId}-` : ''
      const ticketId = data.ticketId || ''
      const featureName = data.featureName ? `--${data.featureName}` : ''
      branchName = `${projectId}${ticketId}${featureName}`
    }

    const id = data.id || 0

    return new Branch({
      id,
      branchName,
      formatId: data.formatId
    })
  }

  private setLastId(): void {
    this.lastId = this.branches.reduce((maxId, branch) => {
      return branch.id > maxId ? branch.id : maxId
    }, 0)
  }

  public createBranch(branchData: Omit<BranchType, 'id'>): void {
    this.setNewId()
    const newBranch = new Branch({
      id: this.lastId,
      branchName: branchData.branchName,
      formatId: branchData.formatId
    })
    this.branches.push(newBranch)
    if (this.branches.length > 10) {
      this.branches.shift()
    }
    this.saveBranches()
  }

  private setNewId() {
    this.lastId = this.lastId + 1
  }

  public deleteBranch(branchId: number): boolean {
    const index = this.branches.findIndex((branch) => branch.id === branchId)
    if (index !== -1) {
      this.branches.splice(index, 1)
      this.saveBranches()
      return true
    }
    return false
  }

  private saveBranches(): void {
    const localStorage = LocalStorageManager.getInstance()
    localStorage.save('branches', JSON.stringify(this.branches))
  }

  public clearBranches(): void {
    this.lastId = 0
    this.branches = []
    this.saveBranches()
  }
}
