const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeIDParameter(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json("Invalid ID!");
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", validadeIDParameter, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repository = repositories.find(repository => {
    return repository.id === id;
  });

  if (!repository) {
    return response.status(400).json("Repository not found!");
  }

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", validadeIDParameter, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id;
  });

  if (repositoryIndex < 0) {
    return response.status(400).json("Repository not found!");
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", validadeIDParameter, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => {
    return repository.id === id;
  });

  if (!repository) {
    return response.status(400).json("Repository not found!");
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
