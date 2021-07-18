import { Body, Controller, Post, Req, UnauthorizedException } from "@nestjs/common";
import { checkCollabToken } from "src/api/check-auth";
import { Subscription } from "src/classes/subscription";
import { PushService } from "./push.service";

@Controller('Push')
export class PushController {
  constructor(private readonly pushService: PushService){}

  @Post()
  async sendNotification(@Req() req, @Body() data: any){
    const auth = await checkCollabToken(req.headers.authorization);
    if (auth != null) {
      return {
        message: this.pushService.sendNotificationToUsers(data)
      }
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }

  @Post('Subscribe')
  async subscribeUser(@Req() req, @Body('StudentId') id: string, @Body('Subscription') subscription: any){
    const auth = await checkCollabToken(req.headers.authorization);
    if (auth != null) {
      if(!subscription) return { message: 'error' }
      return {
        message: this.pushService.pushSubcription(id, subscription)
      }
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }
}