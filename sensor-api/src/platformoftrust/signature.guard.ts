import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from 'rxjs';
import { RsaService } from "./rsa.service";
import { Request } from "express"

@Injectable()
export class SignatureGuard implements CanActivate {

  constructor (private rsaService: RsaService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    let signature = request.headers["x-pot-signature"];
    if (Array.isArray(signature)) {
      signature = signature[0]
    }

    return this.rsaService.verifySignature(request.body, signature);
  }

}