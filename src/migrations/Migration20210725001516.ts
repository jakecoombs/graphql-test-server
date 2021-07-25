import { Migration } from '@mikro-orm/migrations';

export class Migration20210725001516 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "email" text not null;');
  }

}
