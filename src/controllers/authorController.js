const { addAuthorService }  = require("../services/authorService");

exports.AddAuthController = async(req, res) => {
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