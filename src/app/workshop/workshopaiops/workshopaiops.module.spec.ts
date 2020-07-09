import { WorkshopaiopsModule } from './workshopaiops.module';

describe('WorkshopgovModule', () => {
  let workshopgovModule: WorkshopaiopsModule;

  beforeEach(() => {
    workshopgovModule = new WorkshopaiopsModule();
  });

  it('should create an instance', () => {
    expect(workshopgovModule).toBeTruthy();
  });
});
