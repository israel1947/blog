import { IsOptional, IsPositive, Min } from "class-validator";

export class FilterPostsDto{
  @IsOptional()
  @IsPositive()
  page:number
}