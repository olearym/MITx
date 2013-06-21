var explanation = (function() {
	function setup(div) {
		var title = $("<h1>The Burglar's Dilemma</h1>");
		var p1 = $("<p>Being a burglar isn't easy! Our friend below has just entered a house"
		 +" and is trying to decide what to take. Unfortunately his knapsack only holds 20kg."
		 +" Help him pick the objects that will maximize the value of his haul! Just click on an item to change its location.</p>");
		div.append(title, p1);
	}
	return {setup:setup}
}())

var visualization = (function () {

	// on(event_string, callback) -- register handler for event
	// trigger(event_string, data) -- call all callbacks for event_string
	function EventHandler() {
		// map event string to list of callbacks
		//{'update': [ ...View.update... ]}
		var handlers = {};

		function on(event_string, callback) {
			var cblist = handlers[event_string]

			if (cblist === undefined) {
				cblist = [];
				handlers[event_string] = cblist;
			}

			cblist.push(callback);
		}

		function trigger(event_string, data) {
			var cblist = handlers[event_string];

			if (cblist !== undefined) {
				for (var i = 0; i < cblist.length; i += 1) {
					cblist[i](data);
				}
			}
		}

		return{on: on, trigger: trigger}
		}

	// reset() -- sets model to initial values
	function Model(items, maxWeight) {
		var eventHandlers = EventHandler();
		var heldValue = 0;
		var heldWeight = 0;

		function reset() {
			heldValue = 0;
			heldWeight = 0;
			for (item in items) {
				items[item].location = 'home';
				eventHandlers.trigger('item moved', item)
			};
		}

		function getItems() {
			return items;
		}

		function getValue() {
			return heldValue;
		}

		function getWeight() {
			return heldWeight;
		}

		function itemMoved(item) {
			if (item.location == "knapsack") {
				heldValue -= item.value;
				heldWeight -= item.weight;
				item.location = "home";
			} else {
				if (heldWeight + item.weight > maxWeight) {
					eventHandlers.trigger("full knapsack")
					return false;
				}
				heldValue += item.value;
				heldWeight += item.weight;
				item.location = "knapsack";
			}
			eventHandlers.trigger("item moved", item);
			eventHandlers.trigger("updateValue", heldValue)
			eventHandlers.trigger("updateWeight", heldWeight)
			return true;
		}

		return { reset: reset, getItems: getItems,
				 getWeight: getWeight, getValue: getValue,
				 on: eventHandlers.on,
				 itemMoved: itemMoved };

	}

	//
	function Controller(model) {
		var eventHandlers = EventHandler();

		function itemClicked(item) {
			if (!model.itemMoved(item)) {
				eventHandlers.trigger("full knapsack", item);
			}
		}

		return { itemClicked: itemClicked, on: eventHandlers.on };

	}

	function View(div, controller, model) {
		var alert = $('<div class=alert span12>Oh no! Your knapsack full... :(</div>');
		var correctBox = $('<div class=correct span12>Yes! That is correct!</div>');
		var wrongBox = $('<div class=wrong span12>Nope, that is not the best solution.</div>');
		div.append(alert, correctBox, wrongBox);
		inventory = div.append($('<div class=row-fluid></div>'))
		function showAlert() {
			alert.animate({opacity:0.9}, 2000);
			alert.animate({opacity:0.9}, 1000);
			alert.animate({opacity:0}, 2000);
		}

		function checkAnswer() {
			if (model.getValue() == 275) {
				return true;
			}
			return false
		}

		function showCheck() {
			if (checkAnswer()) {
				correctBox.animate({opacity:0.9}, 2000);
				correctBox.animate({opacity:0.9}, 1000);
				correctBox.animate({opacity:0}, 2000);
			} else {
				wrongBox.animate({opacity:0.9}, 2000);
				wrongBox.animate({opacity:0.9}, 1000);
				wrongBox.animate({opacity:0}, 2000);
			}
		}
		controller.on('full knapsack', showAlert);

		var items = model.getItems();

		for (var itemName in items) {
		    var item = items[itemName];
		    var itemDiv = $('<div class="item"></div>');
		    itemDiv.append(item.image);
		    itemDiv.append($('<br>'));
		    itemDiv.append('$'+item.value+', '+item.weight+'kg');
		    item.image[0].item = item;
		    item.image = itemDiv;
		}

		div.on("click", function(event) {
			controller.itemClicked(event.target.item);
		})
		
		var home = $("<div class='span5 location'><header><img src='house.png' class='header-house'></header><div class='span12 items'></div></div>")
		var homeItems = home.find(".items");
		
		var knapsack = $("<div class='span5 location'>"
					+"	 <header><img src='burglar.png' class='header-burglar'><span class='total'>($<span class=value>0</span>/<span class='weight'>0</span>kg)</span></header>"
					+"	 <div class='span12 items'></div></div>");
		var knapsackItems = knapsack.find(".items");
		
		inventory.append(home);
		inventory.append(knapsack);

		function updateItems() {
			homeItems.empty();
			knapsackItems.empty()

			var items = model.getItems();

			for (var itemName in items) {
				var item = items[itemName];
				if (item.location == 'knapsack') {
					knapsackItems.append(item.image);
				} else {
					homeItems.append(item.image);
				}
			}
		}
		model.on('item moved', updateItems)

		function updateValue(value) {
			knapsack.find("span.value").text(value);
		}
		model.on('updateValue', updateValue)

		function updateWeight(weight) {
			knapsack.find("span.weight").text(weight)
		}
		model.on('updateWeight', updateWeight)


		var check = $('<button>Am I right?</button>')
		check.on('click', showCheck)
		div.append(check)


		return{};

	}

	function setup(div) {
		items = {}

		div.find('img').each(function() {
			var image = $(this);
			var name = image.attr("data-name")
			var value = parseInt(image.attr("data-value"))
			var weight = parseInt(image.attr("data-weight"))
			var item = { name: name, value: value, weight: weight, image: image }
			items[name] = item

			itemname: {}

		});
		div.empty()

		var maxWeight = 20
		var model =  Model(items, maxWeight);
		var controller = Controller(model);
		var view = View(div, controller, model)

		model.reset()
	}

	return { setup: setup }
}());

$(document).ready(function() {
	$(".explanation").each(function() {
		explanation.setup($(this));
	});
});

$(document).ready(function() {
	$(".visualization").each(function() {
		visualization.setup($(this));
	});
});