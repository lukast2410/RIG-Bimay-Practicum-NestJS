import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { ExtraClassHeader } from "./extra-class-header.entity";
import { ExtraClassHeaderService } from "./extra-class-header.service";

@Controller('ExtraClassHeader')
export class ExtraClassHeaderController {
    constructor(private readonly headerService: ExtraClassHeaderService){}

    @Get()
    async getAllExtraClass(){
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        return {
            today: await this.headerService.findAllExtraClassToday(now),
            upcoming: await this.headerService.findAllExtraClassUpcoming(now),
            previous: await this.headerService.findAllExtraClassPrevious(now)
        }
    }

    @Get('Assistant/:Initial')
    async findAstExtraClass(@Param('Initial') initial: string){
        const now = new Date()
        const hour = now.getHours()
        const shift = (hour - 5) / 2
        now.setHours(0, 0, 0, 0)
        return {
            today: await this.headerService.findAstExtraClassToday(now, initial),
            no_record: await this.headerService.findNotRecordedAstExtraClass(now, initial, shift)
        }
    }

    @Get('Courses/:Courses')
    async findSubjectsExtraClass(@Param('Courses') courses: string){
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const ids = courses.split(',')
        return { 
            today: await this.headerService.findSubjectExtraClassToday(ids, now),
            upcoming: await this.headerService.findSubjectExtraClassUpcoming(ids, now),
            previous: await this.headerService.findSubjectExtraClassPrevious(ids, now)
        }
    }

    @Get(':id')
    async findExtraClass(@Res({passthrough: true}) res, @Param('id') id: string){
        let data = await this.headerService.findExtraClass(id);
        if(data == null){
            res.status(HttpStatus.NOT_FOUND).json({message: "ID Not Found!"})
            return
        }
        return {
            data
        }
    }

    @Post()
    async insertExtraClass(@Body() extraClass: ExtraClassHeader){
        return {
            data: await this.headerService.insertExtraClass(extraClass)
        }
    }

    @Put(':id')
    async updateExtraClass(@Res({passthrough: true}) res, @Param('id') id: string, @Body() extraClass: ExtraClassHeader){
        let temp = await this.headerService.findExtraClass(id)
        console.log(temp)
        if(temp == null){
            res.status(HttpStatus.NOT_FOUND).json({message: "ID Not Found!"})
            return
        }
        return {
            data: await this.headerService.updateExtraClass(id, extraClass)
        }
    }

    @Delete(':id')
    async deleteExtraClass(@Res({passthrough: true}) res, @Param('id') id: string){
        let temp = await this.headerService.deleteExtraClass(id)
        if(temp.affected == 0){
            res.status(HttpStatus.NOT_FOUND).json({message: "ID Not Found!"})
            return
        }
        return {
            data: temp
        }
    }
};
