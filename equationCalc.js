const infCosts = [...costs.map(row => [...row.map(val => new VirtualNumber(0, val)), new VirtualNumber(1, 0)]),
	[...new Array(receivers.length).fill(new VirtualNumber(1, 0)), new VirtualNumber(0, 0)]];

function calc(basisArray) {
	const uArray = new Array(infCosts.length).fill(undefined);
	const vArray = new Array(infCosts[0].length).fill(undefined);

	uArray[0] = new VirtualNumber(0, 0);

	//v - u = c;

	//v = u + c;
	//u = v - c;
	// for(var b = 0; b < 100; b++)
	while(true) {

		basisArray.forEach(el =>{
			const {i, j} = el;
			if(!uArray[i] && vArray[j])
				uArray[i] = vArray[j].sub(infCosts[i][j])
			if(!vArray[j] && uArray[i])
				vArray[j] = uArray[i].add(infCosts[i][j]);
		});

		if(!vArray.some(el => el == undefined) && !uArray.some(el => el == undefined))
			break;
	}

	reportPotentials(uArray, vArray, basisArray);

	return {vArray, uArray};
}