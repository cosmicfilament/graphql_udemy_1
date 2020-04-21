'use strict';

/**
  * @module schema.js
  * @author John Butler
  * @description 
*/

const graphql = require('graphql');
const axios = require('axios');

const { GraphQLObjectType, GraphQLSchema } = graphql;

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: () => ({
		id: { type: graphql.GraphQLString },
		name: { type: graphql.GraphQLString },
		description: { type: graphql.GraphQLString },
		users: {
			type: new graphql.GraphQLList(UserType),
			resolve (parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then(resp => {
						console.log(`CompanyType.resolve: ${JSON.stringify(resp.data)}`);
						return resp.data;
					});
			}
		}
	})
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: graphql.GraphQLString },
		firstName: { type: graphql.GraphQLString },
		age: { type: graphql.GraphQLInt },
		company: {
			type: CompanyType,
			resolve (parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(resp => {
						console.log(`UserType.resolve: ${JSON.stringify(resp.data)}`);
						return resp.data;
					});
			}
		}
	})
});

// root query is the entry point into graphql
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		user: {
			type: UserType,
			args: { id: { type: graphql.GraphQLString } },
			resolve (parentValue, args) {
				// grabs the data - function returns raw json but graphql turns it into their stuff
				return axios.get(`http://localhost:3000/users/${args.id}`).then(resp => {
					console.log(`rootQuery.User.resolve: ${args.id}`);
					return resp.data;
				});
			}
		},
		company: {
			type: CompanyType,
			args: { id: { type: graphql.GraphQLString } },
			resolve (parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${args.id}`).then(resp => {
					console.log(`rootQuery.Company.resolve: ${args.id}`);
					return resp.data;
				});
			}
		}
	})
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
