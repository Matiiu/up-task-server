import { Router } from 'express';

const router: Router = Router();

router.get('/', (req, res) => {
	res.send('Hello from api/auth');
});

export default router;
