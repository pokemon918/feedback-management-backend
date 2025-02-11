import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CoreEntity } from "./core.entity";

@Entity({ name: "feedback" })
export class FeedbackEntity extends CoreEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ name: "text", length: 1000 })
  text: string;

  @Column({ name: "sentiment_score", type: "float" })
  sentimentScore: number;

  @Column({ name: "sentiment_label", type: "enum", enum: ["Good", "Bad", "Neutral"] })
  sentimentLabel: string;

  @Column({ name: "user_id" })
  userId: string;
} 