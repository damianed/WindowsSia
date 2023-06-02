export namespace main {
	
	
	export class Shortcut {
	    mods: number[];
	    key: number;
	
	    static createFrom(source: any = {}) {
	        return new Shortcut(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mods = source["mods"];
	        this.key = source["key"];
	    }
	}
	export class ShortcutRequest {
	    mods: string[];
	    key: string;
	
	    static createFrom(source: any = {}) {
	        return new ShortcutRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mods = source["mods"];
	        this.key = source["key"];
	    }
	}

}

export namespace openai {
	
	export class ChatCompletionMessage {
	    role: string;
	    content: string;
	    name?: string;
	
	    static createFrom(source: any = {}) {
	        return new ChatCompletionMessage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.role = source["role"];
	        this.content = source["content"];
	        this.name = source["name"];
	    }
	}

}

