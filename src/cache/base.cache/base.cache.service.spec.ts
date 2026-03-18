import {Test, TestingModule} from '@nestjs/testing';
import {BaseCacheService}    from './base.cache.service';



describe('BaseCacheService', () => {
	let service: BaseCacheService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
																		 providers: [BaseCacheService],
																	 }).compile();

		service = module.get<BaseCacheService>(BaseCacheService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
