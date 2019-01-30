function VirtualNumber(startupInfCount, startupValue) {
	this.infCount = startupInfCount;
	this.value = startupValue;

	this.add = (value) =>
	value.infCount ?
	new VirtualNumber(this.infCount + value.infCount, this.value + value.value) :
	new VirtualNumber(this.infCount, this.value + value.value);

	this.sub = (value) =>
	value.infCount ?
	new VirtualNumber(this.infCount - value.infCount, this.value - value.value) :
	new VirtualNumber(this.infCount, this.value - value.value);

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