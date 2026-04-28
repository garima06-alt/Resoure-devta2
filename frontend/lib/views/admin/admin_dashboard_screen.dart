import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/task_providers.dart';
import '../../providers/assignment_providers.dart';
import '../../providers/report_providers.dart';

class AdminDashboardScreen extends ConsumerWidget {
  const AdminDashboardScreen({super.key, this.onNavigateToSettings});

  final VoidCallback? onNavigateToSettings;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tasksAsync = ref.watch(tasksStreamProvider);
    final assignmentsAsync = ref.watch(allAssignmentsStreamProvider);
    final reportsAsync = ref.watch(reportsStreamProvider);

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Dashboard Overview',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'Monitor and manage your organization\'s activities',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
            const SizedBox(height: 24),
            // Statistics Cards
            tasksAsync.when(
              data: (tasks) => assignmentsAsync.when(
                data: (assignments) => reportsAsync.when(
                  data: (reports) => _buildStatisticsGrid(
                    context,
                    tasks.length,
                    assignments.length,
                    reports.length,
                  ),
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (e, _) => Text('Error: $e'),
                ),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Text('Error: $e'),
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Text('Error: $e'),
            ),
            const SizedBox(height: 24),
            // Quick Actions
            Text(
              'Quick Actions',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
            const SizedBox(height: 12),
            _buildQuickActions(context),
          ],
        ),
      ),
    );
  }

  Widget _buildStatisticsGrid(
    BuildContext context,
    int totalTasks,
    int totalAssignments,
    int totalReports,
  ) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: [
        _buildStatCard(
          context,
          title: 'Total Tasks',
          value: totalTasks.toString(),
          icon: Icons.checklist_outlined,
          color: Colors.blue,
        ),
        _buildStatCard(
          context,
          title: 'Active Assignments',
          value: totalAssignments.toString(),
          icon: Icons.assignment_turned_in_outlined,
          color: Colors.green,
        ),
        _buildStatCard(
          context,
          title: 'Reports',
          value: totalReports.toString(),
          icon: Icons.description_outlined,
          color: Colors.orange,
        ),
        _buildStatCard(
          context,
          title: 'Volunteers',
          value: '0',
          icon: Icons.groups_outlined,
          color: Colors.purple,
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: color, size: 28),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    value,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ),
              ],
            ),
            Text(
              title,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: [
        _buildActionChip(
          context,
          label: 'Create Task',
          icon: Icons.add_task,
          onTap: () {},
        ),
        _buildActionChip(
          context,
          label: 'View Reports',
          icon: Icons.analytics,
          onTap: () {},
        ),
        _buildActionChip(
          context,
          label: 'Manage Volunteers',
          icon: Icons.people,
          onTap: () {},
        ),
        _buildActionChip(
          context,
          label: 'Settings',
          icon: Icons.settings,
          onTap: onNavigateToSettings ?? () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Use the drawer menu to access Settings')),
            );
          },
        ),
      ],
    );
  }

  Widget _buildActionChip(
    BuildContext context, {
    required String label,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ActionChip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
      onPressed: onTap,
    );
  }
}
