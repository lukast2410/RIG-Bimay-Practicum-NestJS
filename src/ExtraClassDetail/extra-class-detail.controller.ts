import { Body, Controller, Get, Param, Post, Request, UnauthorizedException } from "@nestjs/common";
import axios from "axios";
import { checkAstToken, checkStudentToken } from "src/api/check-auth";
import { ExtraClassDetail } from "./extra-class-detail.entity";
import { ExtraClassDetailService } from "./extra-class-detail.service";

@Controller('ExtraClassDetails')
export class ExtraClassDetailController {
    constructor(private readonly detailService: ExtraClassDetailService){}

    @Get(':id')
    async findAllDetails(@Request() req, @Param() id: string){
        const auth = await checkAstToken(req.headers.authorization)
        if(auth != null){
            return{
                data: await this.detailService.findAllDetails(id)
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }

    @Post('Present')
    async presentStudent(@Request() req, @Body() data: any){
        const auth = await checkStudentToken(req.headers.authorization)
        if(auth != null){
            let temp = await this.detailService.findOne(data.ExtraClassId, data.StudentId)
            if(temp != null){
                return {
                    data: await this.detailService.updateDetailStatus(data.ExtraClassId, data.StudentId, 'Present')
                }
            }
            data.Status = 'Present'
            data.InsideStudent = false
            return {
                data: await this.detailService.insertDetail(data)
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }
};
