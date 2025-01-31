import FreqAskedQns from "../models/faq.js";

const createFaq = async (req, res) => {
    const { title, description, section } = req.body;
    console.log("createFaq");
    try {
        const faq = await FreqAskedQns.createFaq(title, description, section);

        if (!faq) {
            return res.status(400).json({
                status: 'Error',
                message: 'Failed to create FAQ.'
            });
        }

        res.status(201).json({
            status: 'Success',
            message: 'FAQ created successfully.',
            faq: faq
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error Test',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const getAllFaqs = async (req, res) => {
    try {
        const faqs = await FreqAskedQns.getAllFaqs();

        if (!faqs) {
            return res.status(404).json({
                status: 'Error',
                message: 'FAQs not found.'
            });
        }

        res.status(200).json({
            status: 'Success',
            faqs: faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const getFaqByTitle = async (req, res) => {
    const { title } = req.params;
    try {
        const faq = await FreqAskedQns.getFaqByTitle(title);

        if (!faq) {
            return res.status(404).json({
                status: 'Error',
                message: `FAQ with title ${title} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            faq: faq
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const getFaqBySection = async (req, res) => {
    const { section } = req.params;

    try {
        const faqs = await FreqAskedQns.getFaqBySection(section);

        if (!faqs) {
            return res.status(404).json({
                status: 'Error',
                message: `FAQs with section ${section} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            faqs: faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const updateFaq = async (req, res) => {
    const { title } = req.params;
    const { description, section } = req.body;
    console.log("updateFaq");
    try {
        const faq = await FreqAskedQns.updateFaq(title, description, section);

        if (!faq) {
            return res.status(404).json({
                status: 'Error',
                message: `FAQ with title ${title} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            message: `FAQ with title ${title} updated successfully.`,
            faq: faq
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const deleteFaq = async (req, res) => {
    const { title } = req.params;

    try {
        const faq = await FreqAskedQns.deleteFaq(title);
        console.log("deleteFaq");
        if (!faq) {
            return res.status(404).json({
                status: 'Error',
                message: `FAQ with title ${title} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            message: `FAQ with title ${title} deleted successfully.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const createFaqSection = async (req, res) => {
    const { title, description } = req.body;

    try {
        const section = await FreqAskedQns.createFaqSection(title, description);

        if (!section) {
            return res.status(400).json({
                status: 'Error',
                message: 'Failed to create FAQ section.'
            });
        }

        res.status(201).json({
            status: 'Success',
            message: 'FAQ section created successfully.',
            section: section
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const updateFaqSection = async (req, res) => {
    const { section } = req.params;
    const { description } = req.body;

    try {
        const sections = await FreqAskedQns.updateFaqSection(section, description);

        if (!sections) {
            return res.status(404).json({
                status: 'Error',
                message: `FAQ section with title ${sections} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            message: `FAQ section with title ${sections} updated successfully.`,
            section: sections
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const deleteFaqSection = async (req, res) => {
    const { section } = req.params;

    try {
        const sections = await FreqAskedQns.deleteFaqSection(section);

        if (!sections) {
            return res.status(404).json({
                status: 'Error',
                message: `FAQ section with title ${sections} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            message: `FAQ section with title ${sections} deleted successfully.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const getAllSections = async (req, res) => {
    try {
        const sections = await FreqAskedQns.getAllSections();

        if (!sections) {
            return res.status(404).json({
                status: 'Error',
                message: 'FAQ sections not found.'
            });
        }

        res.status(200).json({
            status: 'Success',
            sections: sections
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const getDetailByTitle = async (req, res) => {
    try {
        const detail = await FreqAskedQns.getDetailByTitle(req.params.title);

        if (!detail) {
            return res.status(404).json({
                status: 'Error',
                message: 'FAQ not found.'
            });
        }

        res.status(200).json({
            status: 'Success',
            detail: detail
        });
    } catch {
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const getAllFaqDetails = async (req, res) => {
    try {
        const details = await FreqAskedQns.getAllFaqDetails();

        if (!details) {
            return res.status(404).json({
                status: 'Error',
                message: 'FAQs not found.'
            });
        }

        res.status(200).json({
            status: 'Success',
            details: details
        });
    } catch {
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const getFaqByCategory = async (req, res) => {
    try {
        const sections = await FreqAskedQns.getFaqByCategory(req.params.category);

        if (!sections) {
            return res.status(404).json({
                status: 'Error',
                message: 'FAQs not found.'
            });
        }

        res.status(200).json({
            status: 'Success',
            sections: sections
        });
    } catch {
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

export default {
    createFaq,
    getAllFaqs,
    getFaqByTitle,
    getFaqBySection,
    updateFaq,
    deleteFaq,
    createFaqSection,
    updateFaqSection,
    deleteFaqSection,
    getAllSections,
    getDetailByTitle,
    getAllFaqDetails,
    getFaqByCategory
}