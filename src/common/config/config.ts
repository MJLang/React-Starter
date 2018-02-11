import { BuildType } from 'app/common/models/build-type';

export abstract class Config {
  public abstract buildType: BuildType;
  public apiURL: string;
}