var keys = {};
keys.backspace = 8;
keys.tab = 9;
keys.enter = 13;
keys.esc = 27;

keys.left = 37;
keys.up = 38;
keys.right = 39;
keys.down = 40;


$("div.content").on("keydown", "li", function (e) {
	return handleMenuKeyDown(this, e);
});

$("div.content").on("keydown", "button", function (e) {
	return handleMenuKeyDown(this, e);
});

$("#searchResults").on("click", "tr", function (e) {
	return handleCellClick(this, e);
});

$("#searchResults").on("keydown", "tr", function (e) {
	return handleCellKeyDown(this, e);
});


getFirstSelectableChild = function(currentCell) {
	if(currentCell == null) {
		return null;
	}
	
	while(currentCell.children.length > 0) {
		currentCell = currentCell.children[0];
	}
	
	currentCell.focus();
	return currentCell;
}

handleCellClick = function(currentCell, e) {
	currentCell.focus();
}

handleCellKeyDown = function(currentCell, e) {

	if (event.ctrlKey == true || event.altKey == true || event.shiftKey == true) {
		return true;
	}

	switch (event.keyCode) {
	case keys.up: {
		currentCell = currentCell.previousElementSibling;
		
		if(currentCell == null) {
			return false;
		}
		
		if(currentCell.children[0].className == "details") {
			currentCell = currentCell.previousElementSibling;
		}
		currentCell = getFirstSelectableChild(currentCell);
		
		event.preventDefault();
		return false;
		break;
	}
	case keys.down: {
		currentCell = currentCell.nextElementSibling;
		
		if(currentCell == null) {
			return false;
		}
		
		if(currentCell.children[0].className == "details") {
			currentCell = currentCell.nextElementSibling;
		}
		currentCell = getFirstSelectableChild(currentCell);
		
		event.preventDefault();
		return false;
		break;
	}
	
	}
} 

handleMenuKeyDown = function(currentCell, e) {

	if (event.ctrlKey == true || event.altKey == true || event.shiftKey == true) {
		return true;
	}

	switch (event.keyCode) {
	case keys.up:
	case keys.left: {
		currentCell = currentCell.previousElementSibling;
		
		if(currentCell == null) {
			return false;
		}
		
		currentCell.focus();
		
		event.preventDefault();
		return false;
		break;
	}
	case keys.down:
	case keys.right: {
		currentCell = currentCell.nextElementSibling;
		
		if(currentCell == null) {
			return false;
		}
		
		currentCell.focus();
		
		event.preventDefault();
		return false;
		break;
	}
	
	}
} 
