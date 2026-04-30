import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParentModule } from './modules/parent/parent.module';
import { StudentModule } from './modules/student/student.module';
import { OrderModule } from './modules/order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemModule } from './modules/menu-item/menu-item.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ParentModule,
    StudentModule,
    OrderModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),

      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        const dataSource = new DataSource(options);
        await dataSource.initialize();

        return addTransactionalDataSource(dataSource);
      },
    }),
    MenuItemModule,
    OrderItemModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
