import {Test, TestingModule}          from '@nestjs/testing';
import {NodeCacheSessionStoreService} from './node_cache.session_store.service';



describe('NodeCacheSessionStoreService', () => {
	let service: NodeCacheSessionStoreService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
																		 providers: [NodeCacheSessionStoreService],
																	 }).compile();

		service = module.get<NodeCacheSessionStoreService>(
			NodeCacheSessionStoreService,
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
