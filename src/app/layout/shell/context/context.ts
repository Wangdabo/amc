export class ShellContext {
    // 系统配置
    public systemConfig: SystemConfig;
    // 界面主题
    public theme: Theme;
}

export class SystemConfig {
  osType: string; // 操作系统
  appPath: string; // 项目路径
  deviceConfig: any; // 外设配置
}

export class Theme {
}
