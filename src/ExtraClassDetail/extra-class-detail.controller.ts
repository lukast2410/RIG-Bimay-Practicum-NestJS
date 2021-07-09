import { Body, Controller, Get, HttpStatus, Param, Post, Res } from "@nestjs/common";
import { ExtraClassDetail } from "./extra-class-detail.entity";
import { ExtraClassDetailService } from "./extra-class-detail.service";

@Controller('ExtraClassDetails')
export class ExtraClassDetailController {
    constructor(private readonly detailService: ExtraClassDetailService){}

    @Get(':id')
    async findAllDetails(@Param() id: string){
        return{
            data: await this.detailService.findAllDetails(id)
        }
    }

    @Post()
    async insertDetail(@Res() res, @Body() data: ExtraClassDetail){
        let temp = await this.detailService.findOne(data.ExtraClassId, data.StudentId)
        if(temp == null){
            res.status(HttpStatus.CONFLICT).json({message: "Data Already Exists!"})
            return
        }
        return {
            data: await this.detailService.insertDetail(data)
        }
    }
};
