function VirtualNumber(startupInfCount, startupValue) {
	this.infCount = startupInfCount;
	this.value = startupValue;

	this.add = (value) =>
	value.infCount != undefined ?
	new VirtualNumber(this.infCount + value.infCount, this.value + value.value) :
	new VirtualNumber(this.infCount, this.value + value);

	this.sub = (value) =>
	value.infCount != undefined ?
	new VirtualNumber(this.infCount - value.infCount, this.value - value.value) :
	new VirtualNumber(this.infCount, this.value - value);

	this.greater = (value) => {
		if(value.infCount != undefined) {
			if(this.infCount == value.infCount)
				return this.value > value.value;
			return this.infCount > value.infCount;
		}

		if(this.infCount != 0)
			return this.infCount > 0;

		return this.value > value;
	}

	this.makeAbs = () => {
		const ic = Math.abs(this.infCount);
		const vl = this.infCount == 0 ? Math.abs(this.value) : (this.infCount < 0 ? -this.value : this.value);

		return new VirtualNumber(ic, vl);
	}

	this.less = (value) => {
		if(value.infCount != undefined) {
			if(this.infCount == value.infCount)
				return this.value < value.value;
			return this.infCount < value.infCount;
		}

		if(this.infCount != 0)
			return this.infCount < 0;

		return this.value < value;
	}

	this.toString = () => {
		this.infCount ? `${this.infCount}${inf}${this.value > 0 ? '+' : ''}${this.value}` : this.value;

		if(this.infCount && this.value)
			return `${this.infCount}${inf}${this.value > 0 ? '+' : ''}${this.value}`;

		if(this.infCount == 0)
			return this.value;

		if(Math.abs(this.infCount) > 1)
			return `${this.infCount}${inf}`;
		else
			return `${this.infCount > 0 ? '' : '-'}${inf}`;
	}
}