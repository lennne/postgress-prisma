const { addAuthorService, getAllAuthorsService, updateAuthorByIdService, getAuthorByIdService, deleteAuthorByIdService }  = require("../services/authorService");

exports.AddAuthorController = async(req, res) => {
    try {
      const { name } = req.body;
      const author  = await addAuthorService(name)

      res.status(201).json({
        success: true,
        author
      })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

exports.getAllAuthorsController = async(req, res) => {
    try {
      const authors  = await getAllAuthorsService()

      res.status(201).json({
        success: true,
        authors
      })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

exports.updateAuthorByIdController = async(req, res) => {
    try {
      const { title, authorId } = req.body;
      const author  = await updateAuthorByIdService(authorId, title)

      res.status(201).json({
        success: true,
        author
      })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

exports.getAuthorByIdController = async(req, res) => {
    try {
      const id = req.params.id;
      const author  = await getAuthorByIdService(parseInt(id))

      res.status(201).json({
        success: true,
        author
      })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

exports.deleteAuthorByIdController = async(req, res) => {
    try {
      const id = req.params.id;
      const author  = await deleteAuthorByIdService(parseInt(id))

      res.status(201).json({
        success: true,
        author
      })

    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}