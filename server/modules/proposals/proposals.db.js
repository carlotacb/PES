const {getCollection, collectionNames, generateNextId} = require('../db')
const collection = () => getCollection(collectionNames.proposals)
const getNextId = () => generateNextId(collectionNames.proposals)

async function create({username, title, content}) {
    const object = {
        id: await getNextId(),
        owner: username,
        title: title,
        content: content,
        createdDateTime: new Date(),
        updatedDateTime: null,
    }
    return collection().insertOne(object)
}

async function getAll() {
    return collection().find().toArray()
}

async function getByUsername({username}) {
    const collection = await getCollection()
    return collection.find({owner: username}, {_id: 0}).toArray()
}

async function getProposalById({id}) {
    const collection = await getCollection()
    return collection.findOne({id: parseInt(id)}, {_id: 0})
}

async function update({id, content, title}) {
    const query = {
        id: parseInt(id)
    }

    const update = {
        $set: {
            updatedDateTime: new Date()
        }
    }

    const options = {
        upsert: false,
        returnOriginal: false
    }

    if (content) {
        update.$set.content = content
    }

    if (title) {
        update.$set.title = title
    }

    const collection = await getCollection()
    return collection.findOneAndUpdate(query, update, options)
        .then(response => response.value)
}

async function deleteProposal({id}) {
    const collection = await getCollection()
    return collection.deleteOne({id:id})
}

module.exports = {
    create: create,
    update: update,
    getAll: getAll,
    getByUsername: getByUsername,
    getProposalById: getProposalById,
    delete: deleteProposal
}