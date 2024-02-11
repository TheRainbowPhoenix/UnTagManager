interface GlobalCTX {
  container: GTAGContainer;
  macros: any[];
}

export class GTAGContainer {
  container: any[] = [];
  trigger: any[] = [];
  variable: any[] = [];
  builtInVariable: any[] = [];

  constructor() {}

  parseMacros(ctx: GlobalCTX) {
    const macros = ctx.macros || [];

    for (let i = 0; i < macros.length; i++) {
      let data = this._parseMacro(ctx, i);

      console.log(JSON.stringify(data));

      if (data) {
        let base = {
          accountId: "0004200000",
          containerId: "000060000",
          fingerprint:
            Math.round(Math.random() * 1000000000000) + 1000000000000,
          formatValue: {},
          data: data,
        };

        this.variable.push(base);
      }
    }
  }

  _parseMacro(ctx: GlobalCTX, index: number) {
    const macro = ctx.macros[index];

    if (parseFunc.hasOwnProperty(macro.function)) {
      const funct: Function = parseFunc[macro.function];
      const data = funct(ctx, macro);
      return data;
    } else {
      console.log("No map for ", macro.function);
      return null;
    }

    // ctx.container.builtInVariable.push
  }

  _parseRecord(ctx: GlobalCTX, r: any[]) {
    if (r[0] == "escape" && r.length > 1) {
      const macro_ref = r[1];
      if (
        Array.isArray(macro_ref) &&
        macro_ref.length > 1 &&
        macro_ref[0] == "macro"
      ) {
        return this._parseMacro(ctx, macro_ref[1]);
      }
    }
  }
}

const parseFunc: Record<string, Function> = {
  // __e => String(a.vtp_gtmCachedValues.event)
  __cid: (ctx: GlobalCTX, a: any) => "{{containerID}}",
  __f: (ctx: GlobalCTX, a: any) => "{{Referrer}}",
  __j: (ctx: GlobalCTX, a: any) =>
    `{{${
      (a.vtp_name &&
        (a.vtp_name.startsWith("js_var_")
          ? a.vtp_name.substring(7)
          : a.vtp_name)) ||
      "__j_error_no_vtp_name"
    }}}`,
  __c: (ctx: GlobalCTX, a: any) => {
    return {
      name: a.vtp_value,
      type: "c",
      parameter: [
        {
          type: "TEMPLATE",
          key: "value",
          value: a.vtp_value,
        },
      ],
    };
  },
  __u: (ctx: GlobalCTX, a: any) => {
    ctx.container.builtInVariable.push({
      accountId: "6104208668",
      containerId: "118969332",
      type: `PAGE_${a.vtp_component}`,
      name: `Page ${a.vtp_component}`,
    });
  },
  __k: (ctx: GlobalCTX, a: any) => {
    return {
      ...(a?.vtp_name && { name: a?.vtp_name }),
      type: "k",
      parameter: [
        {
          type: "BOOLEAN",
          key: "decodeCookie",
          value: a?.vtp_decodeCookie === true ? "true" : "false",
        },
        {
          type: "TEMPLATE",
          key: "name",
          value: a?.vtp_name || "__k_vtp_name",
        },
      ],
    };
  },
  __v: (ctx: GlobalCTX, a: any) => {
    let parameter = [];
    a?.vtp_dataLayerVersion &&
      parameter.push({
        type: "INTEGER",
        key: "dataLayerVersion",
        value: JSON.stringify(a?.vtp_dataLayerVersion),
      });
    a?.vtp_setDefaultValue &&
      parameter.push({
        type: "BOOLEAN",
        key: "setDefaultValue",
        value: JSON.stringify(a?.vtp_setDefaultValue),
      });

    a?.vtp_setDefaultValue &&
      parameter.push({
        type: "TEMPLATE",
        key: "name",
        value: a?.vtp_name || "__k_vtp_name",
      });

    return {
      ...(a?.vtp_name && { name: a?.vtp_name }),
      type: "v",
      parameter: parameter,
    };
  },
  __d: (ctx: GlobalCTX, a: any) => {
    let parameter = [];

    a?.vtp_elementSelector &&
      parameter.push({
        type: "TEMPLATE",
        key: "elementSelector",
        value: a?.vtp_elementSelector,
      });
    a?.vtp_attributeName &&
      parameter.push({
        type: "TEMPLATE",
        key: "attributeName",
        value: a?.vtp_attributeName,
      });
    a?.vtp_attributeName &&
      parameter.push({
        type: "TEMPLATE",
        key: "selectorType",
        value: a?.vtp_selectorType,
      });

    return {
      ...(a?.vtp_attributeName && { name: a?.vtp_attributeName }),
      type: "d",
      parameter: parameter,
    };
  },
  __jsm: (ctx: GlobalCTX, a: any) => {
    if (a?.vtp_javascript) {
      var vtp_js = a.vtp_javascript;
      try {
        const out = vtp_js.map((e: any) =>
          Array.isArray(e) ? ctx.container._parseRecord(ctx, e) : e
        );

        if (out.length > 1) {
          return {
            parameter: [
              {
                type: out[1],
                key: "javascript",
                value: out.slice(1).join(""),
              },
            ],
          };
        }

        // console.log(parsed);
        // var c = X("google_tag_manager");
        // var d = c && c.e && c.e(b);
        // var d = eval(vtp_js);
        // xy(d, "jsm", a.vtp_gtmEventId)

        // "value": "function() {\n return \"custom_js - {{containerID}}:\" + {{containerID}} + \" - {{Referrer}}:\" + {{Referrer}}+ \" - {{attributes.route}}:\" + {{attributes.route}}; \n}"
      } catch (e) {
        console.error(e);
      }
    }
  },
};

// Google DNA stuff bellow

/*

const Ha = Array.isArray;

const ld = /\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/
const md = function(a) {
  if (null == a)
    return String(a);
  let b = ld.exec(Object.prototype.toString.call(Object(a)));
  return b ? b[1].toLowerCase() : "object"
}
const nd = function(a, b) {
  return Object.prototype.hasOwnProperty.call(Object(a), b)
}

const od = function(a) {
  if (!a || "object" != md(a) || a.nodeType || a == a.window)
      return !1;
  try {
      if (a.constructor && !nd(a, "constructor") && !nd(a.constructor.prototype, "isPrototypeOf"))
          return !1
  } catch (c) {
      return !1
  }
  let b = '';
  for (b in a)
      ;
  return void 0 === b || nd(a, b)
}

const td = function(a) {
  if (void 0 == a || Ha(a) || od(a))
      return !0;
  switch (typeof a) {
  case "boolean":
  case "number":
  case "string":
  case "function":
      return !0
  }
  return !1
};

function vu(a, b, c) {
  if (false) { // Ck
      tu[a] = tu[a] || [];
      var d = uu[b] || "0", e;
      e = c instanceof z.Element ? "1" : c instanceof z.Event ? "2" : c instanceof z.RegExp ? "3" : c === z ? "4" : c === I ? "5" : c instanceof z.Promise ? "6" : c instanceof z.Storage ? "7" : c instanceof z.Date ? "8" : c instanceof z.History ? "9" : c instanceof z.Performance ? "a" : c === z.crypto ? "b" : c instanceof z.Location ? "c" : c instanceof z.Navigator ? "d" : "object" !== typeof c || od(c) ? "0" : "e";
      tu[a].push("" + d + e)
  }
}

let tu = {}
let uu = {
  aev: "1",
  c: "2",
  jsm: "3",
  v: "4",
  j: "5",
  smm: "6",
  rmm: "7",
  input: "8"
}

const xy = function(a, b, c) {td(a) || vu(c, b, a)};

*/
