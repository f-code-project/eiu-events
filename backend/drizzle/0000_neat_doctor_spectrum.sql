CREATE TABLE `reward_requests` (
	`id` varchar(36) NOT NULL,
	`player_id` varchar(36) NOT NULL,
	`status` enum('PENDING','COMPLETED') NOT NULL DEFAULT 'PENDING',
	`processed_by` varchar(36),
	`total_score` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`processed_at` timestamp,
	CONSTRAINT `reward_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scores` (
	`id` varchar(36) NOT NULL,
	`player_id` varchar(36) NOT NULL,
	`station_id` varchar(36) NOT NULL,
	`score` int NOT NULL,
	`staff_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scores_id` PRIMARY KEY(`id`),
	CONSTRAINT `player_station_idx` UNIQUE(`player_id`,`station_id`)
);
--> statement-breakpoint
CREATE TABLE `station_staff` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`station_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `station_staff_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_station_idx` UNIQUE(`user_id`,`station_id`)
);
--> statement-breakpoint
CREATE TABLE `stations` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`order` int NOT NULL,
	`is_reward` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`mssv` varchar(20) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('ADMIN','STATION_STAFF','PLAYER') NOT NULL DEFAULT 'PLAYER',
	`reward_status` enum('NONE','PENDING','COMPLETED') NOT NULL DEFAULT 'NONE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_mssv_unique` UNIQUE(`mssv`)
);
--> statement-breakpoint
ALTER TABLE `reward_requests` ADD CONSTRAINT `reward_requests_player_id_users_id_fk` FOREIGN KEY (`player_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reward_requests` ADD CONSTRAINT `reward_requests_processed_by_users_id_fk` FOREIGN KEY (`processed_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_player_id_users_id_fk` FOREIGN KEY (`player_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_station_id_stations_id_fk` FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_staff_id_users_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `station_staff` ADD CONSTRAINT `station_staff_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `station_staff` ADD CONSTRAINT `station_staff_station_id_stations_id_fk` FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `player_reward_idx` ON `reward_requests` (`player_id`);--> statement-breakpoint
CREATE INDEX `station_idx` ON `scores` (`station_id`);