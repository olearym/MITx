var explanation = (function() {
	function setup(div) {
		var title = $("<h1>The Burglar's Dilema</h1>");
		var p1 = $("<p>Being a burglar isn't easy! Our friend above has just entered a house"
		 +" and is trying to decide what to take. Unfortunately his knapsack only holds 20kg."
		 +" What strategy should he use in picking objects so as to maximize the value of his haul?</p>");
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
		heldValue = 0;
		heldWeight = 0;

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
		var alert = $('<div class=alert>Oh no! Your knapsack is too heavy... :(</div>');
		div.append(alert);
		function showAlert() {
			alert.animate({opacity:0.5}, 2000)
			alert.animate({opacity:0.5}, 1000)
			alert.animate({opacity:0}, 2000)
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
		
		var home = $("<div class='location'><header>Home</header><div class='items'></div></div>")
		var homeItems = home.find(".items");
		
		var knapsack = $("<div class='location'>"
					+"	 <header>Knapsack ($<span class=value>0</span>/<span class='weight'>0</span>kg)</header>"
					+"	 <div class='items'></div></div>");
		var knapsackItems = knapsack.find(".items");
		
		div.append(home);
		div.append(knapsack);

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