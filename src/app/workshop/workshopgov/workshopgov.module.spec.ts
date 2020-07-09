import { WorkshopgovModule } from './workshopgov.module';

describe('WorkshopgovModule', () => {
  let workshopgovModule: WorkshopgovModule;

  beforeEach(() => {
    workshopgovModule = new WorkshopgovModule();
  });

  it('should create an instance', () => {
    expect(workshopgovModule).toBeTruthy();
  });
});
