import {Test, TestingModule} from '@nestjs/testing';
import {FactoryCache}        from './factory.cache';



describe('FactoryCache', () => {
	let provider: FactoryCache;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
																		 providers: [FactoryCache],
																	 }).compile();

		provider = module.get<FactoryCache>(FactoryCache);
	});

	it('should be defined', () => {
		expect(provider).toBeDefined();
	});
});
