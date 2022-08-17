const {
    Post,
    Category
} = require("../models");

class PostController {

    // Get Review Data
    static async getReviewData(req, res, next) {
        try {
            const {
                page = 1, categoryId, id, search
            } = req.query;
            let limit = 3;
            let offset = page == 1 ? 0 : limit * (page - 1);
            let whereCondition = {
                status: "Active"
            }
            if (categoryId) {
                whereCondition.genreId = genreId
            }
            if (id) {
                whereCondition.id = id
            }
            if (search) {
                whereCondition.title = {
                    [Op.iLike]: `%${search}%`
                }
            }
            let options = {
                where: whereCondition,
                limit,
                offset,
            }
            let {
                count,
                rows
            } = await Post.findAndCountAll({
                include: Category,
                order: [
                    ["createdAt", "desc"]
                ],
                distict: true,
                ...options
            });
            if (!rows.length) {
                throw {
                    name: "notFound"
                }
            }
            const response = {
                page: +page,
                totalPage: Math.ceil(count / limit),
                reviews: rows
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    // Post Review
    static async postReview(req, res, next) {
        try {
            const UserId = req.user.id;
            const {
                name,
                imageUrl,
                article,
                category
            } = req.body;
            const postArticle = await Post.create({
                UserId,
                CategoryId: category,
                name,
                imageUrl,
                article,
                status: "Active"
            });
            res.status(200).json({
                message: "Success create Post",
                data: postArticle
            });
        } catch (error) {
            next(error);
        }
    }

    // Edit Post
    static async editReview(req, res, next) {
        try {
            const id = req.params.id;
            const UserId = req.user.id;
            const {
                name,
                imageUrl,
                article,
                category,
                status
            } = req.body;
            const updatePost = await Post.update({
                name,
                imageUrl,
                article,
                category,
                status
            }, {
                where: {
                    id
                }
            });
            res.status(200).json({
                message: "Success update data"
            });
        } catch (error) {
            next(error);
        }
    }


}

module.exports = PostController;