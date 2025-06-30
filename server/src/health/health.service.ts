import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async check() {
    const dbStatus = await this.checkDatabase();

    return {
      status: dbStatus ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus ? 'connected' : 'disconnected',
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      if (!this.connection || !this.connection.db) {
        return false;
      }
      const adminDb = this.connection.db.admin();
      await adminDb.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
}
