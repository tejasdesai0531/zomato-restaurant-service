const Restaurant = require('../models/Restaurant');

exports.createRestaurant = async (req, res) => {
  const { name, address } = req.body;

  try {
    const restaurant = new Restaurant({
      name,
      address,
      owner: req.user._id,
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRestaurant = async (req, res) => {
  const { name, address } = req.body;

  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.name = name || restaurant.name;
    restaurant.address = address || restaurant.address;

    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await restaurant.remove();
    res.json({ message: 'Restaurant removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
