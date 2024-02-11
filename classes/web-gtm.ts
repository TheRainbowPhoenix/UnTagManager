type GTM_InlineJsMacro =
  | ["escape", ["macro", number], number]
  | ["escape", ["macro", number], number, number];

type GTM_MixedJSMacro<T extends string | GTM_InlineJsMacro> = T[];

export class GTM_JsMacro implements GTM_JsMacro {
  vtp_javascript: GTM_MixedJSMacro<string | GTM_InlineJsMacro> = [];
}

export interface GTM_Macro {
  function: string;
  vtp_name?: string;
}

interface GTM_Resource {
  version: string | number;
  macros: GTM_Macro[];
}

export interface GTM_Data {
  resource: GTM_Resource;
  runtime: any;
  entities: any;
  security_groups: any;
}
