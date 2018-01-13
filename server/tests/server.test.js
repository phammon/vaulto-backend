const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Password} = require('./../models/password');

describe('POST /passwords', () => {
    it('should create a new password', (done) => {
        var text = 'test password text';

        request(app)
            .post('/passwords')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
    }); 
});