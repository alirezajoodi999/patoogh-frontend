import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Comment } from '../../../../models/comment.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments',
  standalone: false, // ❌ غیر-standalone
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() contentId!: string;

  comments: Comment[] = [];
  loading = false;
  page = 1;
  totalPages = 0;
  totalComments = 0;
  commentForm: FormGroup;
  replyForms: { [key: string]: FormGroup } = {};
  replyVisible: { [key: string]: boolean } = {};
  currentUserId: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id ? String(user.id) : null;
    });
    this.loadComments();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadComments(): void {
    this.loading = true;
    this.subscriptions.push(
      this.commentService.getCommentsByContent(this.contentId, this.page).subscribe({
        next: (response) => {
          this.comments = response.data;
          this.totalPages = response.pagination.pages;
          this.totalComments = response.pagination.total;
          this.loading = false;
          this.comments.forEach(comment => {
            this.replyForms[comment._id] = this.fb.group({
              text: ['', [Validators.required, Validators.maxLength(2000)]]
            });
            this.replyVisible[comment._id] = false;
          });
        },
        error: (err) => {
          this.toastr.error('Failed to load comments');
          this.loading = false;
        }
      })
    );
  }

  submitComment(): void {
    if (this.commentForm.invalid) return;

    this.subscriptions.push(
      this.commentService.createComment({
        contentId: this.contentId,
        text: this.commentForm.value.text
      }).subscribe({
        next: (comment) => {
          this.comments.unshift(comment);
          this.commentForm.reset();
          this.toastr.success('Comment added successfully');
        },
        error: (err) => {
          this.toastr.error('Failed to add comment');
        }
      })
    );
  }

  submitReply(commentId: string): void {
    const form = this.replyForms[commentId];
    if (!form || form.invalid) return;

    this.subscriptions.push(
      this.commentService.createComment({
        contentId: this.contentId,
        parentId: commentId,
        text: form.value.text
      }).subscribe({
        next: (reply) => {
          const parent = this.comments.find(c => c._id === commentId);
          if (parent) {
            if (!parent.replies) parent.replies = [];
            parent.replies.push(reply);
          }
          form.reset();
          this.replyVisible[commentId] = false;
          this.toastr.success('Reply added successfully');
        },
        error: (err) => {
          this.toastr.error('Failed to add reply');
        }
      })
    );
  }

  likeComment(commentId: string): void {
    this.subscriptions.push(
      this.commentService.likeComment(commentId).subscribe({
        next: (response) => {
          const comment = this.findComment(commentId);
          if (comment) {
            if (response.isLiked) {
              comment.likes.push(this.currentUserId!);
            } else {
              const index = comment.likes.indexOf(this.currentUserId!);
              if (index > -1) comment.likes.splice(index, 1);
            }
          }
        },
        error: (err) => {
          this.toastr.error('Failed to like comment');
        }
      })
    );
  }

  deleteComment(commentId: string): void {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.subscriptions.push(
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c._id !== commentId);
          this.toastr.success('Comment deleted');
        },
        error: (err) => {
          this.toastr.error('Failed to delete comment');
        }
      })
    );
  }

  private findComment(commentId: string): Comment | null {
    let comment = this.comments.find(c => c._id === commentId);
    if (comment) return comment;
    for (const c of this.comments) {
      if (c.replies) {
        const reply = c.replies.find(r => r._id === commentId);
        if (reply) return reply;
      }
    }
    return null;
  }

  toggleReply(commentId: string): void {
    this.replyVisible[commentId] = !this.replyVisible[commentId];
  }

  isLiked(comment: Comment): boolean {
    return comment.likes.includes(this.currentUserId!);
  }

  canDelete(comment: Comment): boolean {
    return this.currentUserId === comment.userId._id;
  }
}