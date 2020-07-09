import { ErrorHandler, NgModule } from '@angular/core';

export class MyErrorHandler implements ErrorHandler {
  handleError(error) {
    // alert(error);
    console.error(error);

  }
}

@NgModule({
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }]
})
export class ErrorModule { }
