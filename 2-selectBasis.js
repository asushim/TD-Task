function isLoop(basisArray, i, j) {
	var horizNodes = [];
	var vertNodes = [];
	basisArray.forEach(idx => {
		if(idx.i == i)
			horizNodes.push(idx.j);
		if(idx.j == j)
			vertNodes.push(idx.i);
	});

	return horizNodes.some(hNode => vertNodes.some(vNode => basisArray.some(idx => idx.i == vNode && idx.j == hNode)));
}

function selectBasis(transportData, limitsData, targetCount) {
	var basisArray = [];
	for(var i = 0; i < transportData.length; i++) {
		for(var j = 0; j < transportData[i].length; j++) {
			if(0 < transportData[i][j] && transportData[i][j] < limitsData[i][j])
				basisArray.push({i, j});
		}
	}
	
	const needed = targetCount - basisArray.length;
	for(var z = 0; z < needed; z++) {
		var stop = false;
		for(var i = 0; i < transportData.length && !stop; i++) {
			for(var j = 0; j < transportData[i].length && !stop; j++) {
				if(basisArray.some(idx => idx.i == i && idx.j == j)) continue;

				if(!isLoop(basisArray, i, j)) {
					basisArray.push({i, j});
					stop = true;
				}
			}
		}
	}
	return basisArray;
}