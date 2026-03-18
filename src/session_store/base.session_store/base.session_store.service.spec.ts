import {Test, TestingModule}     from '@nestjs/testing';
import {BaseSessionStoreService} from './base.session_store.service';



describe('BaseSessionStoreService', () => {
	let service: BaseSessionStoreService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
																		 providers: [BaseSessionStoreService],
																	 }).compile();

		service = module.get<BaseSessionStoreService>(BaseSessionStoreService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
