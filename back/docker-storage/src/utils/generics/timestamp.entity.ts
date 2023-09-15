import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class TimeStampEntities {
  @CreateDateColumn({
    update: false, // aucune maj possible
  }) // creer automatiquement la date lorsque le msg est creer
  createdAt: Date;

  @UpdateDateColumn() // maj automatiquement
  updatedAt: Date;

  @DeleteDateColumn() // soft deleted
  deletedAt: Date;
}
