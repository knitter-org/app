import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MigrationService } from './migration.service';

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.less'],
})
export class MigrationComponent implements OnInit {
  currentSchemaVersion!: number;
  targetSchemaVersion!: number;
  migrationActive = false;

  constructor(
    private router: Router,
    private migrationService: MigrationService
  ) {}

  async ngOnInit() {
    this.currentSchemaVersion =
      await this.migrationService.currentSchemaVersion();
    this.targetSchemaVersion = this.migrationService.TARGET_SCHEMA_VERSION;

    this.redirectToRootIfSchemaVersionUpToDate();
  }

  async onMigrateClick() {
    this.migrationActive = true;
    await this.migrationService.migrate();

    // Reload the entire page/application
    window.location.reload();
  }

  private redirectToRootIfSchemaVersionUpToDate() {
    if (this.currentSchemaVersion === this.targetSchemaVersion) {
      this.router.navigateByUrl('/');
    }
  }
}
