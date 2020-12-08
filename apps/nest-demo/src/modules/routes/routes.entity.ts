import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Routes {
  @PrimaryGeneratedColumn()
  readonly id: number;
  //菜单类型
  @Column()
  type: string;
  //菜单图标
  @Column()
  icon: string;
  //菜单名称
  @Column()
  name: string;
  //菜单排序
  @Column()
  sort: Number;
  //菜单状态
  @Column()
  status: Boolean;
  //菜单显示与否
  @Column()
  show: Boolean;
  //父级菜单id
  @Column({nullable:true})
  pid: Number;
  //菜单路径
  @Column()
  path: string;
  //组件路径
  @Column()
  component?: string;
  @Column({ comment: '是否外链' })
  link: Boolean;
  @CreateDateColumn({ comment: '创建日期' })
  createdTime: Date;
  @UpdateDateColumn({ comment: '修改日期' })
  updatedTime: Date;
}
