import { Migration } from '@mikro-orm/migrations';

export class Migration20201116165543 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `sensor` (`id` integer not null primary key autoincrement, `created_at` text not null, `updated_at` text not null, `name` varchar not null, `identifier` varchar not null, `type` varchar not null);');
    this.addSql('create unique index `sensor_identifier_unique` on `sensor` (`identifier`);');
  }

}
