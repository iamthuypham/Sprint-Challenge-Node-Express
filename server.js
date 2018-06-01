// import your node modules
const express = require('express');
const bodyParser = require('body-parser');
const CORS = require('cors');

const port = 5000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(CORS());

const projectDb = require('./data/helpers/projectModel.js');
const actionDb = require('./data/helpers/actionModel.js');

// add your server code starting here
app.get('/api/projects', (_, res) => {
    projectDb.get()
        .then(dbRes => {
            // return res
            res.status(200).json(dbRes)
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The projects information could not be retrieved." })
        })
});

app.get('/api/projects/:id', (req, res) => {
    const { id } = req.params
    projectDb.get(id)
        .then(dbRes => {
            // response from db
            if (dbRes) {
                res.status(200).send(dbRes)
            } else {
                res.status(404).json({ errorMessage: "The project with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The projects information could not be retrieved." })
        })
});

app.post('/api/projects', (req, res) => {
    const { name, description, completed } = req.body
    if (name && description && (typeof completed === 'boolean')) {
        // insert to db
        const obj = projectDb.insert({ name, description, completed })
            .then(dbRes => {
                // return res
                res.status(201).json({ id: dbRes.id, name, description, completed })
            })
            .catch(error => {
                res.status(500).json({ errorMessage: error })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide name, description and completed status for the project." });
    }
});

app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params
    projectDb.remove(id)
        .then(dbRes => {
            // response from db
            if (dbRes != 0) {
                res.status(200).json({ response: "Deleted" })
            } else {
                res.status(404).json({ errorMessage: "The project with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The project could not be removed" })
        })
});

app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params
    const { name, description, completed } = req.body
    if (name && description && (typeof completed === 'boolean')) {
        // insert to db
        const obj = projectDb.update(id, { name, description, completed })
            .then(dbRes => {
                // return res
                const updatedProject = projectDb.get(id)
                    .then(updatedProject => {
                        if (updatedProject) {
                            res.status(200).send(updatedProject)
                        } else {
                            res.status(404).json({ errorMessage: "The project with the specified ID does not exist." })
                        }
                    })
                    .catch(error => {
                        res.status.json({ errorMessage: "The project is updated but cannot retrieve. Try reloading." })
                    })
            })
            .catch(error => {
                res.status(500).json({ errorMessage: "The project information could not be modified." })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide name, description, completed for the project." });
    }
});

app.get('/api/actions', (_, res) => {
    actionDb.get()
        .then(dbRes => {
            // return res
            res.status(200).json(dbRes)
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The actions information could not be retrieved." })
        })
});

app.get('/api/actions/:id', (req, res) => {
    const { id } = req.params
    actionDb.get(id)
        .then(dbRes => {
            // response from db
            if (dbRes) {
                res.status(200).send(dbRes)
            } else {
                res.status(404).json({ errorMessage: "The action with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The actions information could not be retrieved." })
        })
});

app.get('/api/actionsByProject/:id', (req, res) => {
    const { id } = req.params
    projectDb.getProjectActions(id)
        .then(dbRes => {
            // response from db
            if (dbRes) {
                res.status(200).send(dbRes)
            } else {
                res.status(404).json({ errorMessage: "The projects with the specified ID does not exist OR the project does not have any actions." })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ errorMessage: "The actions for the project information could not be retrieved." })
        })
});

app.post('/api/actions', (req, res) => {
    const { project_id, description, notes, completed } = req.body
    if (project_id && description && notes && (typeof completed === 'boolean')) {
        // insert to db
        const obj = actionDb.insert({ project_id, description, notes, completed })
            .then(dbRes => {
                // return res
                res.status(201).json({ id: dbRes.id, project_id, description, notes, completed })
            })
            .catch(error => {
                res.status(500).json({ errorMessage: error })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide project_id, description, notes, completed [boolean type] for the action." });
    }
});

app.delete('/api/actions/:id', (req, res) => {
    const { id } = req.params
    actionDb.remove(id)
        .then(dbRes => {
            // response from db
            if (dbRes != 0) {
                res.status(200).json({ response: "Deleted" })
            } else {
                res.status(404).json({ errorMessage: "The action with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The action could not be removed" })
        })
});

app.put('/api/actions/:id', (req, res) => {
    const { id } = req.params
    const { project_id, description, notes, completed } = req.body
    if (project_id && description && notes && (typeof completed === 'boolean')) {
        // insert to db
        const obj = actionDb.update(id, { project_id, description, notes, completed })
            .then(dbRes => {
                // return res
                const updatedAction = actionDb.get(id)
                    .then(updatedAction => {
                        if (updatedAction) {
                            res.status(200).json({ updatedAction })
                        } else {
                            res.status(404).json({ errorMessage: "The action with the specified ID does not exist." })
                        }
                    })
                    .catch(error => {
                        res.status.json({ errorMessage: "The action is updated but cannot retrieve. Try reloading." })
                    })
            })
            .catch(error => {
                res.status(500).json({ errorMessage: "The action information could not be modified." })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the action." });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});