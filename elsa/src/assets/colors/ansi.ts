/**
 * ANSI SGR (Select Graphic Rendition) escape codes for terminal styling.
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR
 */

export enum AnsiStyle {
    RESET = "\x1b[0m",
    BOLD = "\x1b[1m",
    DIM = "\x1b[2m",
    ITALIC = "\x1b[3m",
    UNDERLINE = "\x1b[4m",
    INVERSE = "\x1b[7m",
    STRIKETHROUGH = "\x1b[9m",
}

export enum AnsiFg {
    BLACK = "\x1b[30m", // #000000
    RED = "\x1b[31m", // #800000
    GREEN = "\x1b[32m", // #008000
    YELLOW = "\x1b[33m", // #808000
    BLUE = "\x1b[34m", // #000080
    MAGENTA = "\x1b[35m", // #800080
    CYAN = "\x1b[36m", // #008080
    WHITE = "\x1b[37m", // #c0c0c0
    DEFAULT = "\x1b[39m",
}

export enum AnsiBg {
    BLACK = "\x1b[40m", // #000000
    RED = "\x1b[41m", // #800000
    GREEN = "\x1b[42m", // #008000
    YELLOW = "\x1b[43m", // #808000
    BLUE = "\x1b[44m", // #000080
    MAGENTA = "\x1b[45m", // #800080
    CYAN = "\x1b[46m", // #008080
    WHITE = "\x1b[47m", // #c0c0c0
    DEFAULT = "\x1b[49m",
}

export enum AnsiFgBright {
    BLACK = "\x1b[90m", // #808080
    RED = "\x1b[91m", // #ff0000
    GREEN = "\x1b[92m", // #00ff00
    YELLOW = "\x1b[93m", // #ffff00
    BLUE = "\x1b[94m", // #0000ff
    MAGENTA = "\x1b[95m", // #ff00ff
    CYAN = "\x1b[96m", // #00ffff
    WHITE = "\x1b[97m", // #ffffff
}

export enum AnsiBgBright {
    BLACK = "\x1b[100m", // #808080
    RED = "\x1b[101m", // #ff0000
    GREEN = "\x1b[102m", // #00ff00
    YELLOW = "\x1b[103m", // #ffff00
    BLUE = "\x1b[104m", // #0000ff
    MAGENTA = "\x1b[105m", // #ff00ff
    CYAN = "\x1b[106m", // #00ffff
    WHITE = "\x1b[107m", // #ffffff
}
