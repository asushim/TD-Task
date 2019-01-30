function VirtualNumber(startupInfCount, startupValue) {
	this.infCount = startupInfCount;
	this.value = startupValue;

	this.addValue = (value) => {
		this.value += value;
	};

	this.addInf = (inf) => {
		if(!inf.infCount || !inf.value)
			throw 'argument is not a type of inf'
		this.infCount += inf.infCount;
		this.value += inf.value;
	};

	this.toString = () => `${this.infCount}${inf}${this.value > 0 ? '+' : ''}${this.value}`
}