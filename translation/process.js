
var 词性_计算机 = "[计]";

function 分词性(中文释义, 所有词性) {
  var 所有释义 = 中文释义.split('\\n');
  var 词性到释义 = {};
  for (var i in 所有释义) {
    var 除去词性 = 所有释义[i];
    var 当前词性 = '';
    for (var j in 所有词性) {
      var 词性 = 所有词性[j];
      if (除去词性.indexOf(词性) == 0) {
        当前词性 = 词性;
        除去词性 = 除去词性.substring(词性.length).trim();
        break;
      }
    }
    // 按逗号分隔词义
    // TODO: 也有分号分隔
    var 词义 = 除去词性.split(/[；;,]/);
    //console.log(词义)
    var 此词性的释义 = []
    for (var 索引 in 词义) {
      此词性的释义.push(词义[索引].trim());
    }
    词性到释义[当前词性] = 此词性的释义;
  }
  return 词性到释义;
}

exports.首选 = function(中文释义, 所有词性) {
  if (!中文释义) {
    return;
  }
  var 首选词义 = "";
  var 词性到释义 = 分词性(中文释义, 所有词性);
  //console.log(词性到释义);
  if (词性到释义[词性_计算机]) {
    首选词义 = 词性到释义[词性_计算机][0];
  } else {
    // 取第一个词性的第一释义
    for (var 词性 in 词性到释义) {
      首选词义 = 词性到释义[词性][0];
      break;
    }
  }
  首选词义 = 消除所有括号内容(首选词义);
  return 首选词义;
}

exports.取复数原型 = function(词, 词形) {
  if (词形) {
    var 原词 = 词;
    var 为复数形式 = false;
    for (某词形 of 词形) {
      if (某词形.类型 == "原型变换形式" && 某词形.变化.includes("名词复数形式")) {
        为复数形式 = true;
      }
      if (某词形.类型 == "原型") {
        原词 = 某词形.变化;
      }
    }
    if (为复数形式) {
      return 原词;
    }
  }
  return 词;
}

///////////////// 原文本处理


// 假设每个字段除了词, 其他都是非英文字符.
// 仅翻译无空格的片段
exports.取字段中所有词 = function(字段文本) {
  // 删去所有前后空格后再提取单词
  var 删除前后空格 = 字段文本.trim();
  // 确认无空格
  if (!删除前后空格.match(/^[^\s]+$/g)) {
    return [];
  }
  var 单词 = 删除前后空格.match(/[a-zA-Z]+/g);
  if (单词) {
    var 分词 = [];
    for (某单词 of 单词) {
      分词 = 分词.concat(拆分骆驼命名(某单词))
    }
    return 分词;
  }
  return [];
}

function 取字段中最长句(字段) {
  var 句 = 字段.match(/[a-zA-Z\s]+/g);
  if (句 && 句.length > 0) {
    return 句[0].trim();
  }
  return 字段;
}

function 拆分骆驼命名(命名) {
  // 参考: https://stackoverflow.com/a/46409373/1536803
  // Firefox仍不支持lookbehinds: https://stackoverflow.com/questions/49816707/firefox-invalid-regex-group
  // 不知为何结果中有空字符串, 暂时过滤即可
  return 命名.split(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/).filter(词 => 词);
}

function 消除所有括号内容(中文释义) {
   // 不确定是否存在多个括号的情况: 清理后.replace(/ *（[^）]*） */g, ""); //
  let 清理后 = 消除括号内容(中文释义, "（", "）");
  清理后 = 清理后.replace(/ *\([^)]*\) */g, "");
  清理后 = 清理后.replace(/ *\[[^)]*\] */g, "");
  return 清理后.trim();
}

function 消除括号内容(中文释义, 开括号, 闭括号) {
  let 开括号位置 = 中文释义.indexOf(开括号);
  let 闭括号位置 = 中文释义.indexOf(闭括号);
  if (开括号位置 == -1 || 闭括号位置 == -1) {
    return 中文释义;
  }
  let 括号内容 = 中文释义.substring(开括号位置, 闭括号位置 + 1);
  return 中文释义.replace(括号内容, "");
}