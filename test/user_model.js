const User = require('../src/models/user');
const chai = require('chai'),
	expect = chai.expect;
const request = require('supertest');
const app = require('../src/server');


describe('Users API tests', function() {

	beforeEach(async function() {
		await User.deleteMany({});
	});

	it('Can create a user', async function() {
		const user = {
			user_id: 12345,
			first_name: 'Mailo',
			last_name: 'Dog',
			zip_code: 12345,
			email_address: 'woof@german.net'
		};

    const res = await request(app)
      .post('/users')
      .send(user);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('user_id', user.user_id);
    expect(res.body).to.have.property('first_name', user.first_name);
    expect(res.body).to.have.property('last_name', user.last_name);
    expect(res.body).to.have.property('zip_code', user.zip_code);
    expect(res.body).to.have.property('email_address', user.email_address);
	});

	it('Can read a user', async function (){
		const user = new User({
			user_id: 12345,
			first_name: 'Mailo',
			last_name: 'Dog',
			zip_code: 12345,
			email_address: 'woof@german.net'
		});

		await user.save();
	
		const res = await request(app)
      .get(`/users/${user.user_id}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('user_id', user.user_id);
    expect(res.body).to.have.property('first_name', user.first_name);
    expect(res.body).to.have.property('last_name', user.last_name);
    expect(res.body).to.have.property('zip_code', user.zip_code);
    expect(res.body).to.have.property('email_address', user.email_address);
	});


	it('Can list all users', async function () {
		const users = [{
			user_id: 12345,
			first_name: 'Mailo',
			last_name: 'Dog',
			zip_code: 12345,
			email_address: 'woof@german.net'
		},{
			user_id: 456790,
			first_name: 'Bella',
			last_name: 'Beez',
			zip_code: 58720,
			email_address: 'ball@park.net'
		}];

		await User.insertMany(users);
	
		const res = await request(app)
      .get('/users');

    expect(res.status).to.equal(200);
    expect(res.body.length).to.equal(2);
	});


	it('Can update a user', async function () {
		const user = new User({
			user_id: 456790,
			first_name: 'Bella',
			last_name: 'Beez',
			zip_code: 58720,
			email_address: 'ball@park.net'
		});

		await user.save();

		const update = {
			first_name: 'Ziggy',
			last_name: 'Zooks'
		};

		const res = await request(app)
			.put(`/users/${user.user_id}`)
			.send(update);

		expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('user_id', user.user_id);
    expect(res.body).to.have.property('first_name', update.first_name);
    expect(res.body).to.have.property('last_name', update.last_name);
	});

	it('Can delete a user', async function (){
		const user = new User({
			user_id: 456790,
			first_name: 'Bella',
			last_name: 'Beez',
			zip_code: 58720,
			email_address: 'ball@park.net'
		});

		await user.save();

		let res = await request(app)
			.delete(`/users/${user.user_id}`);

		expect(res.status).to.equal(200);

		res = await request(app)
			.get(`/users/${user.user_id}`);

		expect(res.status).to.equal(404);
	});

});









